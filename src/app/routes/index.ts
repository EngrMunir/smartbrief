import express from 'express';
import { UserRoutes } from '../../modules/User/user.route';
import { AuthRoutes } from '../../modules/Auth/auth.route';
import { SummaryRoutes } from '../../modules/Summary/summary.route';

const router = express.Router();

const moduleRoutes =[
    {
        path:'/user',
        route: UserRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/summary',
        route:SummaryRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;