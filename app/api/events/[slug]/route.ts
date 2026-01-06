import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

/**
 * Interface định nghĩa params từ dynamic route
 */
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Lấy thông tin chi tiết của event theo slug
 *
 * @param request - Next.js request object
 * @param context - Route context chứa dynamic params
 * @returns Event data hoặc error response
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    // Kết nối database
    await connectDB();

    // Await params để lấy slug (Next.js 15+ async params)
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Slug parameter is required and must be a valid string",
        },
        { status: 400 }
      );
    }

    // Validate slug format (chỉ cho phép chữ cái, số, dấu gạch ngang)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    // Query event từ database theo slug
    const event = await Event.findOne({ slug }).lean();

    // Kiểm tra event có tồn tại không
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: `Event with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    // Return event data thành công
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error để debug (trong production nên dùng logging service)
    console.error("Error fetching event by slug:", error);

    // Xử lý MongoDB specific errors
    if (error instanceof Error) {
      // Cast error nếu là MongoDB error
      if (error.name === "CastError") {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid slug format for database query",
          },
          { status: 400 }
        );
      }

      // Return generic error message (không expose internal details)
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while fetching the event",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    // Fallback error response
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
