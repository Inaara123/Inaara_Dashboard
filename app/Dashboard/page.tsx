"use client"
import { supabase } from '@/SupabaseClient'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Patient {
  patient_id: number;
  hospital_id: number;
  name: string;
  address: string;
  contact_number: string;
  email: string;
  created_at: string;
}

const Page = ({ index }: { index: number }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<{ date: string; visitors: any; fill: string; }[]>([]);
  const patientsPerPage = 5;

  const fetchPatients = async (selectedDate: Date | null) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) {
      setError('Failed to fetch data.');
      console.error(error);
    } else {
      let filteredData = data;

      if (selectedDate) {
        filteredData = data.filter(patient => 
          new Date(patient.created_at).toLocaleDateString() === selectedDate.toLocaleDateString()
        );
      }

      setPatients(filteredData as Patient[]);

      // Group by date and count the number of patients for each date
      const dateCounts = filteredData.reduce((acc, patient) => {
        const date = new Date(patient.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});

      const colorVariables = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
        
        // Add more colors if needed
      ];
      
      // Transform the grouped data into chart data
      const transformedChartData = Object.keys(dateCounts).map((date, index) => ({
        date,
        visitors: dateCounts[date],
        fill: colorVariables[index % colorVariables.length], // Cycle through colors
      }));

      setChartData(transformedChartData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients(date);
  }, [date]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setDate(null); // Reset the date filter when the text filter is used
  };
  const handleClearDate = () => {
    setDate(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filter patients based on the search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(filter.toLowerCase()) ||
    patient.address.toLowerCase().includes(filter.toLowerCase()) ||
    patient.contact_number.toLowerCase().includes(filter.toLowerCase()) ||
    patient.email.toLowerCase().includes(filter.toLowerCase()) ||
    new Date(patient.created_at).toLocaleDateString().includes(filter)
  );

  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / patientsPerPage);

//Pagination logic

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    default: {
      label: "Default",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

  const words = [
    {
      text: "Welcome",
    },
    {
      text: "to",
    },
    {
      text: "the",
    },
  
    {
      text: "Dashboard.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ]

  return (
    <>
      <div className='mt-[100px] ' >
        <div className='ml-[50vh]'>
        <TypewriterEffectSmooth words={words} />
        </div>
        <Card className="flex flex-col w-[400px] ml-[70vh]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Total Patients</CardTitle>
            <CardDescription> July 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="date"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalPatients.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Patients
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        

        <div className="max-w-4xl mx-auto p-4 bg-white mt-[20px] shadow-md rounded-lg">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, address, contact, email, or date..."
              value={filter}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            />
            <div className='mt-2'>
            <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(value: Date | null | undefined) => setDate(value ?? null)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <Button variant="destructive" className='justify-items-end ml-[400px] rounded-xl w-[100px]'
     onClick={handleClearDate}>
       Clear
      </Button>
    </div>
          </div>
          <Table>
            <TableCaption>Patient Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sno</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.map((patient,index) => (
                <TableRow key={patient.patient_id}>
                  <TableCell >{(currentPage - 1) * patientsPerPage + index + 1}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{patient.name}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.contact_number}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell className="text-right">{new Date(patient.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-[50px] mb-[100px]'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPage}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handleNextPage}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}

export default Page;
