import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  // ensure the type is at least class
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// implements != extends
// extends is for extending a class.
// implements is for implementing an interface
// have to have all method that is declared in the interface
export class SerializeInterceptor implements NestInterceptor {
  // except custom dto
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Runs somethings before a request is handled
    // by the request handler
    // console.log('Im running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // data is handler returned data
        // Run something before the response is sent out
        // console.log('Im running before response is sent out', data);

        // Not customize
        // return plainToClass(UserDto, data, {
        //   excludeExtraneousValues: true,
        // }); // transform the class

        // Customize
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }); // transform the class
      }),
    );
  }
}
