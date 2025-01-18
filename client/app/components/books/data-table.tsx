import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookSchema } from "@/lib/schemas";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LayoutGrid, List } from "lucide-react";
import { parseAsJson, parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";
import BookCard from "./book-card";

interface DataTableProps {
  columns: ColumnDef<z.infer<typeof bookSchema>>[];
  data: z.infer<typeof bookSchema>[];
}

export function BooksDataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useQueryState<SortingState>(
    "sort",
    parseAsJson((value: unknown): SortingState => {
      if (Array.isArray(value)) {
        return value as SortingState;
      }
      return [];
    }).withDefault([]),
  );

  const [columnFilters, setColumnFilters] = useQueryState<ColumnFiltersState>(
    "filters",
    parseAsJson((value: unknown): ColumnFiltersState => {
      if (Array.isArray(value)) {
        return value as ColumnFiltersState;
      }
      return [];
    }).withDefault([]),
  );

  const [isGridView, setIsGridView] = useQueryState(
    "view",
    parseAsStringEnum(["grid", "list"]).withDefault("list"),
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: async (updater) => {
      const newValue =
        typeof updater === "function" ? updater(sorting) : updater;
      await setSorting(newValue);
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: async (updater) => {
      const newValue =
        typeof updater === "function" ? updater(columnFilters) : updater;
      await setColumnFilters(newValue);
    },
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const filteredData = table.getRowModel().rows.map((row) => row.original);

  const toggleView = async () => {
    await setIsGridView(isGridView === "grid" ? "list" : "grid");
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button
            variant={isGridView === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => toggleView()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={isGridView === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => toggleView()}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isGridView === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.length > 0 ? (
            filteredData.map((book, index) => (
              <BookCard key={index} book={book} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center">No results.</div>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
