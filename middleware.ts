import { authMiddleware } from '@clerk/nextjs';

/**
 * https://stackoverflow.com/questions/77549993/how-to-resolve-errors-around-uploadthing-and-nextjs-the-upload-functionality-wo
 * api/uploadthingをpublicにしないと通らない
 */
export default authMiddleware({
  publicRoutes: ['/api/webhook'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
