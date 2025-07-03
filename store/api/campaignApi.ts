import { campaign_url } from "../constant";
import { apiSlice } from "./apiSlcie"; // check typo in file name if needed

// Define campaign type (optional but helpful)
export interface CampaignPayload {
  campaignName: string;
  fromEmail: string;
  senderName: string;
  templateId: number;
  leadGroupId: number;
}

export const CompaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCampaign: builder.mutation<any, CampaignPayload>({
      query: (data) => ({
        url: campaign_url,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateCampaignMutation } = CompaignApi;
