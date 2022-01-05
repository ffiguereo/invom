import create from 'zustand';

export const useInvoiceStore = create((set) => ({
  invoice: null,
  update: (invoice) => set({ invoice }),
  clear: () => set({ invoice: null }),
}));
