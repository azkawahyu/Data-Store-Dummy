import { getEmployees } from "@/lib/services/employee/getEmployees";

export async function GET() {
  const employees = await getEmployees();
  return Response.json(employees);
}