// 'use client';

// import React from "react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import { StarterKit } from "@tiptap/starter-kit";
// import TipTapMenuBar from "./TipTapMenuBar";
// import { Button } from "./ui/button";
// import { useDebounce } from "@/lib/useDebounce";
// import { useMutation } from "@tanstack/react-query";
// import Text from "@tiptap/extension-text";
// import axios from "axios";
// import { NoteType } from "@/lib/db/schema";
// // Removed: import { useCompletion } from "ai/react";

// type Props = { note: NoteType };

// // Define the expected response structure from your completion API
// type CompletionResponse = {
//   content: string;
// };
// const TipTapEditor = ({ note }: Props) => {
//   const [editorState, setEditorState] = React.useState(
//     note.editorState || `<h1>${note.name}</h1>`
//   );
//   const [lastSavedState, setLastSavedState] = React.useState(editorState); // ✅ Track last saved

//   // Save mutation
//   const saveNote = useMutation({
//     mutationFn: async () => {
//       const response = await axios.post("/api/saveNote", {
//   noteId: note.id,
//   editorState,
// }, {
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

//       return response.data;
//     },
//     onSuccess: () => {
//       setLastSavedState(editorState); // ✅ Update saved snapshot
//       console.log("Saved successfully.");
//     },
//     onError: (err) => {
//       console.error("Save failed:", err);
//     },
//   });
//   // --- Mutation for AI Completion ---
//   const getCompletion = useMutation<CompletionResponse, Error, string>({ // Specify types: Response, Error, Variables (prompt)
//     mutationFn: async (prompt: string) => {
//       // *** IMPORTANT: Ensure '/api/completion' matches your backend route ***
//       const response = await axios.post<CompletionResponse>("/api/completion", { // Expect CompletionResponse
//         prompt,
//       });
//       return response.data;
//     },
//   });

//   const customText = Text.extend({
//     addKeyboardShortcuts() {
//       return {
//         "Shift-a": () => {
//           if (!this.editor) return false; // Guard clause

//           // take the last 30 words (or adjust as needed)
//           const promptText = this.editor.getText().split(" ").slice(-30).join(" ");
//           console.log("Prompting with:", promptText); // For debugging

//           // Trigger the mutation
//           getCompletion.mutate(promptText, {
//             onSuccess: (data) => {
//               console.log("Completion received:", data); // For debugging
//               if (data.content && this.editor) {
//                 // Insert the received content
//                 this.editor.commands.insertContent(data.content);
//               }
//             },
//             onError: (error) => {
//               console.error("AI Completion Error:", error);
//               // Optionally show an error to the user
//             },
//           });

//           return true; // Indicate the shortcut was handled
//         },
//       };
//     },
//   });

//   const editor = useEditor({
//     autofocus: true,
//     extensions: [StarterKit, customText], // Use the modified customText
//     content: editorState,
//     onUpdate: ({ editor }) => {
//       setEditorState(editor.getHTML());
//     },
//   });

//   const debouncedEditorState = useDebounce(editorState, 500);

//   // ✅ Fix infinite loop: Only save if content has actually changed
//   React.useEffect(() => {
//     if (
//       debouncedEditorState === "" ||
//       debouncedEditorState === lastSavedState
//     )
//       return;

//     saveNote.mutate();
//   }, [debouncedEditorState, lastSavedState]);

//   return (
//     <>
//       <div className="flex">
//         {editor && <TipTapMenuBar editor={editor} />}
//         <Button disabled variant={"outline"}>
//           {/* Show completion status maybe? */}
//           {getCompletion.isPending ? "AI Thinking..." : (saveNote.isPending ? "Saving..." : "Saved")}
//         </Button>
//       </div>

//       <div className="prose prose-sm w-full mt-4">
//         <EditorContent editor={editor} />
//       </div>
//       <div className="h-4"></div>
//       <span className="text-sm">
//         Tip: Press{" "}
//         <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
//           Shift + A
//         </kbd>{" "}
//         for AI autocomplete {getCompletion.isPending && "(Loading...)"}
//         {getCompletion.isError && "(Error!)"}
//       </span>
//     </>
//   );
// };


// export default TipTapEditor;



'use client';

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";

type Props = { note: NoteType };

type CompletionResponse = {
  content: string;
};

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`
  );
  const [lastSavedState, setLastSavedState] = React.useState(editorState);

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      return response.data;
    },
    onSuccess: () => {
      setLastSavedState(editorState);
      console.log("Saved successfully.");
    },
    onError: (err) => {
      console.error("Save failed:", err);
    },
  });

  const getCompletion = useMutation<CompletionResponse, Error, string>({
    mutationFn: async (prompt: string) => {
      const response = await axios.post<CompletionResponse>("/api/completion", {
        prompt,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          if (!this.editor) return false;

          const promptText = this.editor.getText().split(" ").slice(-30).join(" ");
          console.log("Prompting with:", promptText);

          getCompletion.mutate(promptText, {
            onSuccess: (data) => {
              console.log("Completion received:", data);
              if (data.content && this.editor) {
                this.editor.commands.insertContent(data.content);
              }
            },
            onError: (error) => {
              console.error("AI Completion Error:", error);
            },
          });

          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    immediatelyRender: false,  // ✅ Fix for SSR Hydration mismatch
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const debouncedEditorState = useDebounce(editorState, 500);

  React.useEffect(() => {
    if (
      debouncedEditorState === "" ||
      debouncedEditorState === lastSavedState
    ) return;

    saveNote.mutate();
  }, [debouncedEditorState, lastSavedState]);

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"}>
          {getCompletion.isPending ? "AI Thinking..." : (saveNote.isPending ? "Saving..." : "Saved")}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + A
        </kbd>{" "}
        for AI autocomplete {getCompletion.isPending && "(Loading...)"}
        {getCompletion.isError && "(Error!)"}
      </span>
    </>
  );
};

export default TipTapEditor;
