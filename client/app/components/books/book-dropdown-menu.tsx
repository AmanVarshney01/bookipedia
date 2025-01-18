import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteBookDialog } from "./delete-book-dialog";
import { UpdateBookDialog } from "./update-book-dialog";
import type { bookSchema } from "@/lib/schemas";
import type { z } from "zod";

export default function BookDropdownMenu({
  book,
}: {
  book: z.infer<typeof bookSchema>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UpdateBookDialog book={book} />
        <DropdownMenuSeparator />
        <DeleteBookDialog bookId={book.id} bookTitle={book.title} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
