import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "../types";

export const EMPLOYEES_KEY = ["employees"];

export interface EmployeeParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof Employee;
  order?: "asc" | "desc";
  status?: "active" | "inactive" | "";
}
export const defaultEmployeeParams: Required<EmployeeParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
  status: "",
};

export const normalizeEmployeeParams = (params: EmployeeParams) => {
  return {
    ...defaultEmployeeParams,
    ...params,
  };
};

const getEmployees = async (
  params: EmployeeParams
): Promise<ApiResponse<Paginated<Employee>>> => {
  const normalized = normalizeEmployeeParams(params);

  const response = await api$.get<ApiResponse<Paginated<Employee>>>(
    "/employees",
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    }
  );

  return response.data;
};

export const getEmployeesQueryOptions = (params: EmployeeParams) => {
  const normalized = normalizeEmployeeParams(params);
  return {
    queryKey: [EMPLOYEES_KEY, normalized],
    queryFn: () => getEmployees(normalized),
  };
};

type UseEmployeesOptions = {
  params?: EmployeeParams;
  queryConfig?: Partial<QueryConfig<typeof getEmployeesQueryOptions>>;
};

export const useEmployees = ({ params, queryConfig }: UseEmployeesOptions) => {
  return useQuery({
    ...getEmployeesQueryOptions(params || {}),
    ...queryConfig,
  });
};
