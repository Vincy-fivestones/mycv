import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); // get the request
    // console.log(request.session.userId);
    // return 'hi there';

    // get the currentUser from request (searching it)
    return request.currentUser;
  },
);
