import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { Booking, BookingResponse } from '../types/booking.types';

export class BookingApiClient extends BaseApiClient {
  private readonly basePath = '/booking';

  async getAllBookingIds(): Promise<{ bookingid: number }[]> {
    const response = await this.get(this.basePath);
    return this.expectJson(response, 200);
  }

  async getBooking(bookingId: number): Promise<Booking> {
    const response = await this.get(`${this.basePath}/${bookingId}`);
    return this.expectJson(response, 200);
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    const response = await this.post(this.basePath, booking);
    return this.expectJson(response, 200);
  }

  async updateBooking(bookingId: number, booking: Booking, token: string): Promise<Booking> {
    const response = await this.put(`${this.basePath}/${bookingId}`, booking, {
      Cookie: `token=${token}`,
    });
    return this.expectJson(response, 200);
  }

  async partialUpdateBooking(
    bookingId: number,
    partialBooking: Partial<Booking>,
    token: string
  ): Promise<Booking> {
    const response = await this.patch(`${this.basePath}/${bookingId}`, partialBooking, {
      Cookie: `token=${token}`,
    });
    return this.expectJson(response, 200);
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.delete(`${this.basePath}/${bookingId}`, {
      Cookie: `token=${token}`,
    });
  }
}