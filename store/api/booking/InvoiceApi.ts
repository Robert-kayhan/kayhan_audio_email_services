import { apiSlice } from "../apiSlcie";
export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET invoices (with search + pagination)
    getAllInvoices: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/invoices?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // DELETE invoice by id
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/api/invoices/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetAllInvoicesQuery, useDeleteInvoiceMutation } = invoiceApi;
