import { campaign_url, email_url } from "../constant";
import { apiSlice } from "./apiSlcie"; // check typo in file name if needed
export interface SendUsingExcelPayload {
  campaignName: string;
  campaignSubject: string;
  fromEmail: string;
  senderName: string;
  templateId: number;
  file: File; // excel file
}
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
    getAllCampaign: builder.query<
      any,
      { page?: number; limit?: number; templateType?: "Retail" | "wholeSale" }
    >({
      query: ({ page = 1, limit = 25, templateType } = {}) => ({
        url: campaign_url,
        method: "GET",
        params: { page, limit, templateType }, // send as query params
      }),
    }),

    getAllCampaignByid: builder.query({
      query: (data) => ({
        url: `${campaign_url}/${data}`,
        method: "GET",
      }),
    }),
    deleteCampaign: builder.mutation({
      query: (data) => ({
        url: `${campaign_url}/${data}`,
        method: "DELETE",
      }),
    }),
    updateCampaign: builder.mutation({
      query: ({ id, data }) => ({
        url: `${campaign_url}/${data}`,
        method: "PUT",
        body: data,
      }),
    }),
    sendComgain: builder.mutation({
      query: (data) => ({
        url: `${email_url}/${data}`,
        method: "POST",
      }),
    }),
    sendUsingExcel: builder.mutation<any, SendUsingExcelPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("campaignName", data.campaignName);
        formData.append("campaignSubject", data.campaignSubject);
        formData.append("fromEmail", data.fromEmail);
        formData.append("senderName", data.senderName);
        formData.append("templateId", String(data.templateId));
        formData.append("file", data.file);

        return {
          url: `${campaign_url}/send-using-exel`, // ✅ must match backend route
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useGetAllCampaignByidQuery,
  useGetAllCampaignQuery,
  useDeleteCampaignMutation,
  useSendComgainMutation,
  useUpdateCampaignMutation,
  useSendUsingExcelMutation
} = CompaignApi;
