import { columns } from "@/components/books/columns";
import { CreateBookDialog } from "@/components/books/create-book-dialog";
import { BooksDataTable } from "@/components/books/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function DashboardIndex() {
  const { data: books, isLoading } = trpc.books.getAll.useQuery();

  return (
    <div className="rounded-lg bg-card p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between border-b-2 border-primary/20 pb-4">
        <h1 className="font-serif text-3xl font-bold text-primary">
          My Library
        </h1>
        <CreateBookDialog />
      </div>
      {isLoading ? (
        <Skeleton className="h-44 w-full" />
      ) : (
        <div className="rounded-md">
          <BooksDataTable columns={columns} data={books || []} />
        </div>
      )}
    </div>
  );
}
