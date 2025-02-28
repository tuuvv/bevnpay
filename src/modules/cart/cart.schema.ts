import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ required: true, type: Object })
    data: Object;

    @Prop({ required: true })
    cart_id: string;

    @Prop({ required: true })
    payment_status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
