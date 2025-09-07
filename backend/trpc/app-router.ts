import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";

// Auth routes
import { registerProcedure } from "./routes/auth/register/route";
import { loginProcedure } from "./routes/auth/login/route";
import { activateProcedure } from "./routes/auth/activate/route";
import { forgotPasswordProcedure } from "./routes/auth/forgot-password/route";
import { resetPasswordProcedure } from "./routes/auth/reset-password/route";
import { getUserProcedure } from "./routes/auth/get-user/route";
import { logoutProcedure } from "./routes/auth/logout/route";

// Task routes
import { createTaskProcedure } from "./routes/tasks/create-task/route";
import { getTasksProcedure } from "./routes/tasks/get-tasks/route";
import { updateTaskProcedure } from "./routes/tasks/update-task/route";
import { deleteTaskProcedure } from "./routes/tasks/delete-task/route";
import { toggleTaskProcedure } from "./routes/tasks/toggle-task/route";

// Finance routes
import { setIncomeProcedure } from "./routes/finance/set-income/route";
import { getIncomeProcedure } from "./routes/finance/get-income/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  
  // Auth procedures
  auth: createTRPCRouter({
    register: registerProcedure,
    login: loginProcedure,
    activate: activateProcedure,
    forgotPassword: forgotPasswordProcedure,
    resetPassword: resetPasswordProcedure,
    getUser: getUserProcedure,
    logout: logoutProcedure,
  }),
  
  // Task procedures
  tasks: createTRPCRouter({
    create: createTaskProcedure,
    getTasks: getTasksProcedure,
    update: updateTaskProcedure,
    delete: deleteTaskProcedure,
    toggle: toggleTaskProcedure,
  }),
  
  // Finance procedures
  finance: createTRPCRouter({
    setIncome: setIncomeProcedure,
    getIncome: getIncomeProcedure,
  }),
});

export type AppRouter = typeof appRouter;