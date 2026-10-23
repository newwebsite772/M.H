import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createBooking,
  createClient,
  createService,
  findClientByName,
  findServiceByName,
  listBookings,
} from "./db";

const bookingStatus = z.enum(["confirmed", "in_progress", "completed", "pending", "cancelled"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  bookings: router({
    list: protectedProcedure.query(async () => listBookings()),
    create: protectedProcedure
      .input(z.object({
        customerName: z.string().trim().min(2).max(180),
        phone: z.string().trim().max(40).optional(),
        serviceName: z.string().trim().min(2).max(180),
        city: z.string().trim().max(80).optional(),
        scheduledAt: z.coerce.date(),
        teamName: z.string().trim().max(120).optional(),
        amount: z.number().nonnegative().max(999999999),
        status: bookingStatus.default("confirmed"),
      }))
      .mutation(async ({ input, ctx }) => {
        let client = await findClientByName(input.customerName);
        if (!client) {
          const clientId = await createClient({ name: input.customerName, phone: input.phone, city: input.city });
          client = { id: clientId, name: input.customerName } as typeof client;
        }
        let service = await findServiceByName(input.serviceName);
        if (!service) {
          const serviceId = await createService({ name: input.serviceName, price: input.amount.toFixed(2) });
          service = { id: serviceId, name: input.serviceName } as typeof service;
        }
        const bookingNumber = `BK-${Date.now().toString().slice(-7)}`;
        return createBooking({
          bookingNumber,
          clientId: client.id,
          serviceId: service.id,
          city: input.city,
          scheduledAt: input.scheduledAt,
          teamName: input.teamName,
          amount: input.amount.toFixed(2),
          status: input.status,
          createdBy: ctx.user.id,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
