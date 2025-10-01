// src/tools/pms/pms_index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getTimeFrames, getTimeFramesQuery } from "./getTimeFrames";
import { getGoals, getGoalsQuery } from "./getGoals";
import { updateGoalProgress, updateGoalProgressParams, updateGoalProgressBody } from "./updateGoalProgress";
import { getBadges, getBadgesQuery } from "./getBadges";
import { getPraise, getPraiseQuery } from "./getPraise";
import { addPraise, addPraiseBody } from "./addPraise";
import { getReviewGroups, getReviewGroupsQuery } from "./getReviewGroups";
import { getReviewCycles, getReviewCyclesQuery } from "./getReviewCycles";
import { getReviews, getReviewsQuery } from "./getReviews";

export function registerPmsTools(server: McpServer, env: Env) {
  // GET /pms/timeframes
  server.tool(
    "getTimeFrames",
    "Use this tool to get all time frames for performance management",
    {
      query: getTimeFramesQuery
    },
    async ({ query }) => {
      try {
        const timeFrames = await getTimeFrames(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(timeFrames, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching time frames: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /pms/goals
  server.tool(
    "getGoals",
    "Use this tool to get goals with parent-child relationships",
    {
      query: getGoalsQuery
    },
    async ({ query }) => {
      try {
        const goals = await getGoals(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(goals, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching goals: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // PUT /pms/goals/{goalId}/progress
  server.tool(
    "updateGoalProgress",
    "Use this tool to update the progress of a goal",
    {
      goalId: updateGoalProgressParams.shape.goalId,
      body: updateGoalProgressBody
    },
    async ({ goalId, body }) => {
      try {
        const result = await updateGoalProgress(env, goalId, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating goal progress: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /pms/badges
  server.tool(
    "getBadges",
    "Use this tool to get all badges for employee recognition",
    {
      query: getBadgesQuery
    },
    async ({ query }) => {
      try {
        const badges = await getBadges(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(badges, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching badges: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /pms/praise
  server.tool(
    "getPraise",
    "Use this tool to get employee praise records",
    {
      query: getPraiseQuery
    },
    async ({ query }) => {
      try {
        const praise = await getPraise(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(praise, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching praise: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // POST /pms/praise
  server.tool(
    "addPraise",
    "Use this tool to add praise/recognition for employees",
    {
      body: addPraiseBody
    },
    async ({ body }) => {   
      try {
        const result = await addPraise(env, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error adding praise: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // GET /pms/reviewGroups
  server.tool(
    "getReviewGroups",
    "Use this tool to get all review groups",
    {
      query: getReviewGroupsQuery
    },
    async ({ query }) => {
      try {
        const reviewGroups = await getReviewGroups(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(reviewGroups, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching review groups: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // GET /pms/reviewCycles
  server.tool(
    "getReviewCycles",
    "Use this tool to get all review cycles",
    {
      query: getReviewCyclesQuery
    },
    async ({ query }) => {      
      try {
        const reviewCycles = await getReviewCycles(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(reviewCycles, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching review cycles: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // GET /pms/reviews
  server.tool(
    "getReviews",
    "Use this tool to get all reviews",
    {
      query: getReviewsQuery
    },
    async ({ query }) => {
      try {
        const reviews = await getReviews(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(reviews, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching reviews: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
