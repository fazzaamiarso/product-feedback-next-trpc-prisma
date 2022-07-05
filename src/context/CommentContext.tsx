import { createContext, ReactNode, useState, useContext } from "react";

type CommentCtx = {
  openReplyId: string | null;
  updateOpenReplyId: (id: string) => void;
};
const commentContext = createContext<CommentCtx | null>(null);
export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);

  const updateOpenReplyId = (id: string) => setOpenReplyId(openReplyId === id ? null : id);

  return (
    <commentContext.Provider value={{ openReplyId, updateOpenReplyId }}>
      {children}
    </commentContext.Provider>
  );
};
export const useComment = () => {
  const ctx = useContext(commentContext);
  if (!ctx) throw Error("Used context outside of provider!");
  return ctx;
};
