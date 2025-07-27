export const parseAndLoadDesign = (
  design: string | object,
  emailEditorRef: React.RefObject<any>
): void => {
  if (!emailEditorRef.current) return;

  const parsedDesign = typeof design === "string" ? JSON.parse(design) : design;
  emailEditorRef.current?.editor.loadDesign(parsedDesign);
};
