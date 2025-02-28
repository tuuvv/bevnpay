import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
  ) {}

  /**
   * Create a new cart
   * @param createCartDto - Data Transfer Object for creating a cart
   * @returns The created cart document
   */
  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const newCart = new this.cartModel(createCartDto);
      return await newCart.save();
    } catch (error) {
      throw new HttpException(
        'Error creating cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing cart
   * @param updateCartDto - Data Transfer Object for updating a cart
   * @returns An object indicating whether the update was successful
   */
  async updateCart(updateCartDto: UpdateCartDto): Promise<{ updated: boolean }> {
    try {
      const cartId = updateCartDto.cart_id;
      const updateResult = await this.cartModel.updateOne(
        { cart_id: cartId },
        {
          payment_status: updateCartDto.payment_status,
          data: updateCartDto.data,
        },
      );

      if (updateResult.modifiedCount === 0) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      return { updated: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
