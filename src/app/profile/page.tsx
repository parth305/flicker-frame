"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, BookmarkIcon, Tag, Settings } from "lucide-react";
import Sidebar from "@/components/sidebar";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Main content wrapper with sidebar offset */}
      <div className="md:pl-64">
        {/* Profile content with responsive padding */}
        <div className="max-w-4xl mx-auto p-4 pb-20 md:p-8 md:pb-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8">
            {/* Profile Picture */}
            <div className="relative">
              <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-4 md:gap-8 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-center">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="tagged" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Tagged</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <BookmarkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts Grid */}
            <TabsContent value="posts">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-2">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="aspect-square">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tagged Posts */}
            <TabsContent value="tagged">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-2">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="aspect-square">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Saved Posts */}
            <TabsContent value="saved">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-2">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="aspect-square">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
