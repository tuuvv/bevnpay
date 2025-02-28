import { IsNotEmpty} from 'class-validator';

export class CreateCartDto {
 @IsNotEmpty() data: any;
  @IsNotEmpty() cart_id: string;
  @IsNotEmpty() payment_status: string;
}
export class CreatePaymentDto {
   @IsNotEmpty() amount: number;
  @IsNotEmpty() orderInfo: any;
}
