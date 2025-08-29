"use client";
import { useState, useEffect, useRef } from "react";
import { useSendFlyerMutation } from "@/store/api/flyer/FlyerApi";
import { useRouter } from "next/navigation";

interface EmailTemplateModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  flyer_image_url?: string;
  initialTopText?: string;
  initialBottomText?: string;
  initialSubject?: string;
  userData?: any;
}

const fonts = [
  "Arial",
  "Times New Roman",
  "Roboto",
  "Georgia",
  "Verdana",
  "Courier New",
];

export default function EmailTemplateModal({
  open,
  setOpen,
  flyer_image_url = "",
  initialTopText = "",
  initialBottomText = "",
  initialSubject = "",
  userData,
}: EmailTemplateModalProps) {
  const [subject, setSubject] = useState(initialSubject);

  // Top text states
  const [topText, setTopText] = useState(initialTopText);
  const [topSize, setTopSize] = useState(24);
  const [topAlign, setTopAlign] = useState<"left" | "center" | "right">("center");
  const [topFont, setTopFont] = useState(fonts[0]);
  const [topBold, setTopBold] = useState(false);
  const [topItalic, setTopItalic] = useState(false);
  const [topColor, setTopColor] = useState("#000000");

  // Bottom text states
  const [bottomText, setBottomText] = useState(initialBottomText);
  const [bottomSize, setBottomSize] = useState(18);
  const [bottomAlign, setBottomAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [bottomFont, setBottomFont] = useState(fonts[0]);
  const [bottomBold, setBottomBold] = useState(false);
  const [bottomItalic, setBottomItalic] = useState(false);
  const [bottomColor, setBottomColor] = useState("#000000");

  const flyerRef = useRef<HTMLDivElement>(null);
  const [sendFlyer] = useSendFlyerMutation();
  const router = useRouter()
  useEffect(() => {
    setSubject(initialSubject);
    setTopText(initialTopText);
    setBottomText(initialBottomText);
  }, [flyer_image_url, initialTopText, initialBottomText, initialSubject, open]);

  if (!open) return null;

  const handleSave = async () => {
    const combinedHtml = `
      <div>
        <div style="
          font-size:${topSize}px; 
          text-align:${topAlign}; 
          font-family:${topFont}; 
          font-weight:${topBold ? "bold" : "normal"};
          font-style:${topItalic ? "italic" : "normal"};
          color:${topColor};
        ">${topText}</div>

        ${flyer_image_url ? `<div style="text-align:center; margin:10px 0;">
          <img src="${flyer_image_url}" style="max-width:100%; height:auto;" />
        </div>` : ""}

        <div style="
          font-size:${bottomSize}px; 
          text-align:${bottomAlign}; 
          font-family:${bottomFont};
          font-weight:${bottomBold ? "bold" : "normal"};
          font-style:${bottomItalic ? "italic" : "normal"};
          color:${bottomColor};
        ">${bottomText}</div>
      </div>
    `;

    try {
      await sendFlyer({
        userData,
        combinedHtml,
        subject,
      });
      router.push("/dashboard/lead-folow-up")
    } catch (error) {
      console.error("Send flyer failed:", error);
    }
    console.log("Generated HTML:", combinedHtml);
  };

  const renderTextControls = (
    text: string,
    setText: (val: string) => void,
    size: number,
    setSize: (val: number) => void,
    align: "left" | "center" | "right",
    setAlign: (val: "left" | "center" | "right") => void,
    font: string,
    setFont: (val: string) => void,
    bold: boolean,
    setBold: (val: boolean) => void,
    italic: boolean,
    setItalic: (val: boolean) => void,
    color: string,
    setColor: (val: string) => void
  ) => (
    <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
      <div className="flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Enter text..."
        />
      </div>
      <div>
        <input
          type="number"
          min={10}
          max={72}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-20 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          title="Font Size"
        />
      </div>
      <div>
        <select
          value={align}
          onChange={(e) => setAlign(e.target.value as any)}
          className="w-24 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          title="Alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-28 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          title="Font"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setBold(!bold)}
          className={`px-2 py-1 border rounded ${bold ? "bg-blue-600 text-white" : ""}`}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => setItalic(!italic)}
          className={`px-2 py-1 border rounded ${italic ? "bg-blue-600 text-white" : ""}`}
          title="Italic"
        >
          I
        </button>
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 p-0 border-0"
        title="Text Color"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-y-auto p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Send Flyer</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {userData && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
            <span className="font-medium">To:</span>{" "}
            {`${userData.firstName} ${userData.lastName}`} ({userData.email})
          </div>
        )}

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter subject..."
          />
        </div>

        {/* Top Text Controls */}
        <label className="block text-sm font-medium mb-1">Top Text</label>
        {renderTextControls(
          topText,
          setTopText,
          topSize,
          setTopSize,
          topAlign,
          setTopAlign,
          topFont,
          setTopFont,
          topBold,
          setTopBold,
          topItalic,
          setTopItalic,
          topColor,
          setTopColor
        )}

        {/* Flyer Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Flyer Preview</label>
          <div
            ref={flyerRef}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 min-h-[300px] bg-gray-50 dark:bg-gray-800 overflow-auto flex flex-col items-stretch"
          >
            <div
              style={{
                fontSize: `${topSize}px`,
                textAlign: topAlign,
                fontFamily: topFont,
                fontWeight: topBold ? "bold" : "normal",
                fontStyle: topItalic ? "italic" : "normal",
                color: topColor,
                marginBottom: 10,
              }}
            >
              {topText}
            </div>

            {flyer_image_url && (
              <div className="flex justify-center">
                <img
                  src={flyer_image_url}
                  alt="Flyer"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <div
              style={{
                fontSize: `${bottomSize}px`,
                textAlign: bottomAlign,
                fontFamily: bottomFont,
                fontWeight: bottomBold ? "bold" : "normal",
                fontStyle: bottomItalic ? "italic" : "normal",
                color: bottomColor,
                marginTop: 10,
              }}
            >
              {bottomText}
            </div>
          </div>
        </div>

        {/* Bottom Text Controls */}
        <label className="block text-sm font-medium mb-1">Bottom Text</label>
        {renderTextControls(
          bottomText,
          setBottomText,
          bottomSize,
          setBottomSize,
          bottomAlign,
          setBottomAlign,
          bottomFont,
          setBottomFont,
          bottomBold,
          setBottomBold,
          bottomItalic,
          setBottomItalic,
          bottomColor,
          setBottomColor
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-auto">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Save & Send
          </button>
        </div>
      </div>
    </div>
  );
}
