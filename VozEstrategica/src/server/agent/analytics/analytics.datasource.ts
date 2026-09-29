/**
 * Analytics Data Source
 * Provides business metrics from Supabase.
 * Server-side only.
 */

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  OrderMetrics,
  LeadMetrics,
  SalesMetrics,
  BusinessMetrics,
  TrafficMetrics,
  EngagementMetrics,
  FunnelMetrics,
  SpeakerMetrics,
  ContentMetrics,
} from "../admin/business-intelligence.types";

/**
 * Get business metrics (orders, leads, sales).
 */
export async function getBusinessMetrics(
  period: string,
): Promise<BusinessMetrics> {
  try {
    const [orders, bookOrders, bookingRequests] = await Promise.all([
      supabaseAdmin.from("orders").select("*"),
      supabaseAdmin.from("pedidos_libros").select("*"),
      supabaseAdmin.from("booking_requests").select("*"),
    ]);

    const orderData = orders.data ?? [];
    const bookData = bookOrders.data ?? [];
    const leadData = bookingRequests.data ?? [];

    // Calculate metrics
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce(
      (sum, o) => sum + (o.amount || 0),
      0,
    );

    const totalBooks = bookData.length;
    const bookRevenue = bookData.reduce((sum, b) => sum + (b.total || 0), 0);

    const totalLeads = leadData.length;
    const conversionRate = totalLeads > 0 ? (totalOrders / totalLeads) * 100 : 0;

    return {
      period,
      orders: {
        totalOrders,
        totalRevenue,
        averageOrderValue:
          totalOrders > 0 ? totalRevenue / totalOrders : 0,
        ordersThisMonth: totalOrders, // TODO: filter by date
        revenueThisMonth: totalRevenue, // TODO: filter by date
      },
      leads: {
        totalLeads,
        newLeadsThisMonth: totalLeads, // TODO: filter by date
        conversionRate,
        qualifiedLeads: totalLeads, // TODO: implement qualification logic
        averageLeadValue:
          totalLeads > 0 ? totalRevenue / totalLeads : 0,
      },
      sales: {
        totalBooksSold: totalBooks,
        bookRevenue,
        averageBookPrice:
          totalBooks > 0 ? bookRevenue / totalBooks : 0,
        booksThisMonth: totalBooks, // TODO: filter by date
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[AnalyticsDataSource] Error getting business metrics:", err);
    throw err;
  }
}

/**
 * Get speaker performance metrics.
 * Analyzes inquiries, bookings, and revenue by speaker.
 */
export async function getContentMetrics(): Promise<ContentMetrics> {
  try {
    const [speakers, bookingRequests, orders] = await Promise.all([
      supabaseAdmin.from("speakers").select("*"),
      supabaseAdmin.from("booking_requests").select("*"),
      supabaseAdmin.from("orders").select("*"),
    ]);

    const speakersData = speakers.data ?? [];
    const inquiriesData = bookingRequests.data ?? [];
    const ordersData = orders.data ?? [];

    const speakerMetrics: SpeakerMetrics[] = speakersData.map((speaker) => {
      const inquiries = inquiriesData.filter(
        (i) => i.speaker_id === speaker.id,
      ).length;
      const bookings = inquiries > 0 ? Math.floor(inquiries * 0.3) : 0; // TODO: actual booking data
      const revenue = bookings * 5000; // TODO: actual revenue

      return {
        speakerId: speaker.id,
        name: speaker.nombre,
        inquiries,
        bookings,
        eventCount: bookings,
        conversionRate:
          inquiries > 0 ? (bookings / inquiries) * 100 : 0,
        revenue,
      };
    });

    const topicTrends: Record<string, number> = {};
    speakersData.forEach((s) => {
      s.tematicas?.forEach((topic: string) => {
        topicTrends[topic] = (topicTrends[topic] || 0) + 1;
      });
    });

    return {
      speakers: speakerMetrics,
      topSpeaker:
        speakerMetrics.length > 0
          ? speakerMetrics.reduce((max, s) =>
              s.revenue > max.revenue ? s : max,
            )
          : undefined,
      topicTrends,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[AnalyticsDataSource] Error getting content metrics:", err);
    throw err;
  }
}

/**
 * Get funnel metrics.
 * In future, track through GA4 or custom events.
 * For now, approximates from Supabase data.
 */
export async function getFunnelMetrics(): Promise<FunnelMetrics> {
  try {
    const [subscribers, bookingRequests, orders] = await Promise.all([
      supabaseAdmin.from("subscribers").select("count"),
      supabaseAdmin.from("booking_requests").select("count"),
      supabaseAdmin.from("orders").select("count"),
    ]);

    const awareness = subscribers.count || 0;
    const consideration = bookingRequests.count || 0;
    const conversion = orders.count || 0;

    const overallConversionRate =
      awareness > 0 ? (conversion / awareness) * 100 : 0;

    return {
      awareness: {
        name: "Awareness",
        count: awareness,
        conversionRate: awareness > 0 ? (consideration / awareness) * 100 : 0,
      },
      consideration: {
        name: "Consideration",
        count: consideration,
        conversionRate:
          consideration > 0 ? (conversion / consideration) * 100 : 0,
      },
      conversion: {
        name: "Conversion",
        count: conversion,
        conversionRate: 100,
      },
      dropoffPoints: [],
      overallConversionRate,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[AnalyticsDataSource] Error getting funnel metrics:", err);
    throw err;
  }
}

/**
 * Get engagement metrics.
 * Placeholder — will be enhanced with GA4 Data API integration.
 */
export async function getEngagementMetrics(): Promise<EngagementMetrics> {
  // TODO: Integrate GA4 Data API
  return {
    traffic: {
      uniqueUsers: 0,
      sessions: 0,
      engagedSessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
    },
    topPages: [],
    events: {},
    lastUpdated: new Date().toISOString(),
  };
}
