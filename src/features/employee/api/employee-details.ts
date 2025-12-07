import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "../types";

export const EMPLOYEE_KEY = "employee-details";

const getEmployee = async (id: string): Promise<ApiResponse<Employee>> => {
  const response = await api$.get<ApiResponse<Employee>>(`/employees/${id}`);

  return response.data;
};

export const getEmployeeQueryOptions = (id: string) => {
  return {
    queryKey: [EMPLOYEE_KEY, id],
    queryFn: () => getEmployee(id),
  };
};

type UseEmployeeOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getEmployeeQueryOptions>>;
};

export const useEmployee = ({ id, queryConfig }: UseEmployeeOptions) => {
  return useQuery({
    ...getEmployeeQueryOptions(id),
    ...queryConfig,
  });
};
