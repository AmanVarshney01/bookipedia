import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().nullable().optional(),
  price: z.number().min(1, "Price must be at least 1"),
  publishedAt: z.string().transform((date) => new Date(date)),
});

export const booksRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        price: true,
        publishedAt: true,
      },
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const book = await prisma.book.findUnique({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });

      if (!book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }

      return book;
    }),

  create: protectedProcedure.input(bookSchema).mutation(({ ctx, input }) => {
    return prisma.book.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: bookSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const book = await prisma.book.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }

      return prisma.book.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const book = await prisma.book.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }

      return prisma.book.delete({
        where: { id: input },
      });
    }),
});
