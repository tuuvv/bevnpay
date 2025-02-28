import { Controller, Post, Body, Get, Query, HttpStatus, HttpException, Req, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreatePaymentDto } from './dto/create-cart.dto';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly configService: ConfigService
  ) {}
 @Post('create-payment-url')
 async paymentOrders(@Body() payment: CreatePaymentDto) {
    try {
      const ipAddr = '127.0.0.1';
      let tmnCode = this.configService.get<string>('VNP_TMN_CODE');
      let secretKey = this.configService.get<string>('VNP_HASH_SECRET');
      let vnpUrl = this.configService.get<string>('VNP_URL');
      let returnUrl = this.configService.get<string>('VNP_RETURN_URL');

      let createDate = dayjs().format('YYYYMMDDHHmmss');
      let orderId = dayjs().format('DDHHmmss');
      let amount = payment?.amount;
      let bankCode = '';

      let orderInfo = JSON.stringify(payment?.orderInfo);
      let orderType = 'other';
      let locale = 'vn';
      let currCode = 'VND';
      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = orderInfo;
      vnp_Params['vnp_OrderType'] = orderType;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = this.sortObject(vnp_Params);

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      await this.cartService.createCart({
          data: orderInfo,
          cart_id: payment?.orderInfo.cart_id,
          payment_status: "PENDING"
        });
      return {
        url: vnpUrl,
        vnp_TxnRef: orderId,
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      
    }
  }
  @Post('/verify-checkout')
   async verifyCheckout(@Body() payment: any, @Req() request: Request) {
    try {
      const secureHash = payment['vnp_SecureHash'];
      delete payment['vnp_SecureHash'];

      const sortedParams = this.sortObject(payment);
      const secretKey = process.env.VNP_HASH_SECRET;
      const querystring = require('qs');
      const signData = querystring.stringify(sortedParams, { encode: false });
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        return { checked: false };
      }

      if (payment.vnp_ResponseCode === '00') {
        const orderInfo = JSON.parse(payment.vnp_OrderInfo);
        await this.cartService.updateCart({
          data: orderInfo,
          cart_id: orderInfo.cart_id,
          payment_status: "DONE"
        });

        return {
          orderInfo,
          checked:true
        };
      } else {
        return { checked: false };
      }
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

    sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  @Post()
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @Put()
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }
}
