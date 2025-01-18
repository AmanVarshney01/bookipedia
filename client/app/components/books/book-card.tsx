import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { bookSchema } from "@/lib/schemas";
import { BookOpen, Calendar, IndianRupee, User } from "lucide-react";
import type { z } from "zod";
import BookDropdownMenu from "./book-dropdown-menu";
import { format } from "date-fns";

export default function BookCard({
  book,
}: {
  book: z.infer<typeof bookSchema>;
}) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-blue-500" />
          {book.title}
        </CardTitle>
        <BookDropdownMenu book={book} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{book.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4" />
            <span>${book.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(book.publishedAt), "PPP")}</span>
          </div>
        </div>
        {/* {book.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {book.description}
          </p>
        )} */}
      </CardContent>
    </Card>
  );
}
