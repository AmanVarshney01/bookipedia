import { columns } from "@/components/books/columns";
import { CreateBookDialog } from "@/components/books/create-book-dialog";
import { BooksDataTable } from "@/components/books/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function DashboardIndex() {
  const { data: books, isLoading } = trpc.books.getAll.useQuery();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Books</h1>
        <CreateBookDialog />
      </div>

      {isLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <BooksDataTable columns={columns} data={books || []} />
      )}
    </div>
  );
}
