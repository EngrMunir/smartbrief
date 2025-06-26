// types/express/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
        email: string;
        credits: number;
      };
    }
  }
}

export {};
