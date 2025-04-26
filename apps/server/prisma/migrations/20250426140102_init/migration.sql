-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('PENDING', 'LIVE', 'ENDED', 'FAILED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "ContentModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'PRO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "rtmp_url" TEXT NOT NULL,
    "stream_key" TEXT NOT NULL,
    "status" "StreamStatus" NOT NULL DEFAULT 'PENDING',
    "moderationStatus" "ContentModerationStatus" NOT NULL DEFAULT 'PENDING',
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "scheduled_start_time" TIMESTAMP(3),
    "peak_viewers" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "average_watch_time" INTEGER,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamAnalytics" (
    "id" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "viewer_count" INTEGER NOT NULL DEFAULT 0,
    "chat_message_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,
    "report_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "moderationStatus" "ContentModerationStatus" NOT NULL DEFAULT 'PENDING',
    "user_id" TEXT NOT NULL,
    "stream_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnalytics" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,
    "report_count" INTEGER NOT NULL DEFAULT 0,
    "average_watch_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_categories" (
    "video_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_categories_pkey" PRIMARY KEY ("video_id","category_id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "moderated_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watched" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "video_id" TEXT,
    "stream_id" TEXT,
    "watched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER,
    "duration" INTEGER,

    CONSTRAINT "Watched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "video_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "device" TEXT,
    "country" TEXT,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLike" (
    "user_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoLike_pkey" PRIMARY KEY ("user_id","video_id")
);

-- CreateTable
CREATE TABLE "StreamLike" (
    "user_id" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamLike_pkey" PRIMARY KEY ("user_id","stream_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "thumbnail_url" TEXT,
    "user_id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistCollaborator" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "added_by" TEXT NOT NULL,

    CONSTRAINT "PlaylistCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "video_id" TEXT,
    "stream_id" TEXT,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    "added_by" TEXT NOT NULL,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "payment_method_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reported_user_id" TEXT,
    "video_id" TEXT,
    "stream_id" TEXT,
    "chat_message_id" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_stream_key_key" ON "Stream"("stream_key");

-- CreateIndex
CREATE INDEX "Stream_user_id_idx" ON "Stream"("user_id");

-- CreateIndex
CREATE INDEX "Stream_status_idx" ON "Stream"("status");

-- CreateIndex
CREATE INDEX "Stream_is_live_idx" ON "Stream"("is_live");

-- CreateIndex
CREATE INDEX "Stream_scheduled_start_time_idx" ON "Stream"("scheduled_start_time");

-- CreateIndex
CREATE UNIQUE INDEX "StreamAnalytics_stream_id_key" ON "StreamAnalytics"("stream_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_stream_id_key" ON "Video"("stream_id");

-- CreateIndex
CREATE INDEX "Video_user_id_idx" ON "Video"("user_id");

-- CreateIndex
CREATE INDEX "Video_moderationStatus_idx" ON "Video"("moderationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "VideoAnalytics_video_id_key" ON "VideoAnalytics"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "ChatMessage_stream_id_idx" ON "ChatMessage"("stream_id");

-- CreateIndex
CREATE INDEX "ChatMessage_user_id_idx" ON "ChatMessage"("user_id");

-- CreateIndex
CREATE INDEX "ChatMessage_sent_at_idx" ON "ChatMessage"("sent_at");

-- CreateIndex
CREATE INDEX "Watched_user_id_video_id_idx" ON "Watched"("user_id", "video_id");

-- CreateIndex
CREATE INDEX "Watched_user_id_stream_id_idx" ON "Watched"("user_id", "stream_id");

-- CreateIndex
CREATE INDEX "Watched_watched_at_idx" ON "Watched"("watched_at");

-- CreateIndex
CREATE INDEX "View_video_id_idx" ON "View"("video_id");

-- CreateIndex
CREATE INDEX "View_user_id_idx" ON "View"("user_id");

-- CreateIndex
CREATE INDEX "View_viewed_at_idx" ON "View"("viewed_at");

-- CreateIndex
CREATE INDEX "VideoLike_video_id_idx" ON "VideoLike"("video_id");

-- CreateIndex
CREATE INDEX "StreamLike_stream_id_idx" ON "StreamLike"("stream_id");

-- CreateIndex
CREATE INDEX "Playlist_user_id_idx" ON "Playlist"("user_id");

-- CreateIndex
CREATE INDEX "Playlist_is_public_idx" ON "Playlist"("is_public");

-- CreateIndex
CREATE INDEX "Playlist_is_featured_idx" ON "Playlist"("is_featured");

-- CreateIndex
CREATE INDEX "PlaylistCollaborator_playlist_id_idx" ON "PlaylistCollaborator"("playlist_id");

-- CreateIndex
CREATE INDEX "PlaylistCollaborator_user_id_idx" ON "PlaylistCollaborator"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistCollaborator_playlist_id_user_id_key" ON "PlaylistCollaborator"("playlist_id", "user_id");

-- CreateIndex
CREATE INDEX "PlaylistItem_playlist_id_position_idx" ON "PlaylistItem"("playlist_id", "position");

-- CreateIndex
CREATE INDEX "PlaylistItem_video_id_idx" ON "PlaylistItem"("video_id");

-- CreateIndex
CREATE INDEX "PlaylistItem_stream_id_idx" ON "PlaylistItem"("stream_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_idx" ON "Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_tier_idx" ON "Subscription"("tier");

-- CreateIndex
CREATE INDEX "Subscription_is_active_idx" ON "Subscription"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transaction_id_key" ON "Payment"("transaction_id");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_created_at_idx" ON "Payment"("created_at");

-- CreateIndex
CREATE INDEX "Report_reporter_id_idx" ON "Report"("reporter_id");

-- CreateIndex
CREATE INDEX "Report_reported_user_id_idx" ON "Report"("reported_user_id");

-- CreateIndex
CREATE INDEX "Report_video_id_idx" ON "Report"("video_id");

-- CreateIndex
CREATE INDEX "Report_stream_id_idx" ON "Report"("stream_id");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamAnalytics" ADD CONSTRAINT "StreamAnalytics_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnalytics" ADD CONSTRAINT "VideoAnalytics_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLike" ADD CONSTRAINT "VideoLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLike" ADD CONSTRAINT "VideoLike_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamLike" ADD CONSTRAINT "StreamLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamLike" ADD CONSTRAINT "StreamLike_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCollaborator" ADD CONSTRAINT "PlaylistCollaborator_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCollaborator" ADD CONSTRAINT "PlaylistCollaborator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
