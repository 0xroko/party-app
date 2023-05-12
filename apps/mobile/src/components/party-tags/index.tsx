import { Button } from "@components/button";
import { Div, T } from "@components/index";
import { Input } from "@components/input";
import { onSupabaseError } from "@lib/actions";
import { supabase } from "@lib/supabase";
import { Field, Form } from "houseform";
import { Pressable } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useMutation } from "react-query";
import { z } from "zod";
import { create } from "zustand";

export const useMutatePartyTags = (partyId: string) => {
  const m = useMutation(async (tags: string[]) => {
    const { data, error } = await supabase
      .from("Party")
      .update({ tags })
      .eq("id", partyId);
    if (error) {
      onSupabaseError(error);
    }
  });

  return m;
};

interface TagsStore {
  tags: string[];
  deleteTag: (tag: string) => void;
  addTag: (tag: string) => void;
  initialWasSet: boolean;
  setInitial: (tags: string[]) => void;
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  reset: () => void;
}

export const useTagsStore = create<TagsStore>((set, get) => ({
  tags: [],
  reset: () => {
    set((s) => ({ tags: [], initialWasSet: false }));
  },
  deleteTag: (tag) => {
    set((s) => ({ tags: s.tags.filter((t) => t !== tag) }));
  },
  addTag: (tag) => {
    set((s) => ({ tags: [...s.tags, tag] }));
  },

  initialWasSet: false,
  setInitial: (tags) => {
    const wasSet = get().initialWasSet;
    if (!wasSet) {
      set((s) => ({ tags, initialWasSet: true }));
    }
  },
  dialogVisible: false,
  setDialogVisible: (visible) => {
    set((s) => ({ dialogVisible: visible }));
  },
}));

interface AddDialogProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const AddDialog = ({ children }: AddDialogProps) => {
  const { tags, addTag, dialogVisible, setDialogVisible } = useTagsStore();

  if (!dialogVisible) return null;

  return (
    <Div
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
      className={`absolute z-50 inset-0 flex justify-center items-center`}
    >
      <Div
        className={`min-h-[200px] bg-black border border-accents-3 mx-9 rounded-3xl p-8 flex flex-col`}
      >
        <T className={`font-figtree-bold text-white text-xl mb-7`}>Dodaj tag</T>

        <Form
          onSubmit={(values) => {
            addTag(values.tag);
          }}
        >
          {({ isValid, submit }) => (
            <>
              <Field
                name="tag"
                onChangeValidate={z
                  .string()
                  .min(2, "Min. 2 znaka")
                  .max(30, "Max. 30 znakova")
                  .superRefine((val, ct) => {
                    if (tags.includes(val)) {
                      ct.addIssue({
                        code: "custom",
                        message: "Tag već postoji",
                      });
                    }
                  })}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      autoFocus={true}
                      onBlur={onBlur}
                      onChangeText={(text) => setValue(text)}
                      placeholder={"Tag"}
                      error={errors?.[0]}
                    />
                  );
                }}
              </Field>
              <Div className={`flex flex-row justify-end mt-8 g-3`}>
                <Button
                  intent="secondary"
                  onPress={() => {
                    setDialogVisible(false);
                  }}
                >
                  Odustani
                </Button>
                <Button
                  disabled={!isValid}
                  onPress={() => {
                    submit();
                    setDialogVisible(false);
                  }}
                >
                  Dodaj
                </Button>
              </Div>
            </>
          )}
        </Form>
      </Div>
    </Div>
  );
};

interface TagProps {
  children?: React.ReactNode | React.ReactNode[];
  tag?: string;
  onDelete?: () => void;
  type?: "add" | "delete";
}

export const Tag = ({ children, tag, onDelete, type = "delete" }: TagProps) => {
  return (
    <Div
      className={` py-1.5  border flex-row h-9 rounded-full flex justify-center items-center 
      g-2 ${
        type === "delete"
          ? "bg-white border-black px-3"
          : "bg-black border-white px-5"
      }`}
    >
      <T
        className={`${
          type === "delete" ? "text-black  ml-2" : "text-white"
        } font-figtree-semi-bold text-base`}
      >
        {tag}
      </T>
      {onDelete && (
        <Pressable onPress={() => onDelete?.()}>
          <XMarkIcon size={24} color={"black"} />
        </Pressable>
      )}
    </Div>
  );
};

interface TagContainerProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const TagContainer = ({ children }: TagContainerProps) => {
  const { tags, deleteTag, dialogVisible, setDialogVisible } = useTagsStore();

  return (
    <Div className={`flex g-2`}>
      <T className={`text-accents-11 font-figtree-semi-bold text-sm`}>Tagovi</T>
      <Div
        className={`flex flex-row flex-wrap g-4 bg-accents-1 rounded-2xl p-5 border-accents-2 border`}
      >
        {tags?.map((tag, i) => {
          return <Tag tag={tag} key={i} onDelete={() => deleteTag(tag)} />;
        })}
        {tags?.length < 5 && (
          <Pressable
            onPress={() => {
              setDialogVisible(true);
            }}
          >
            <Tag type="add" tag={"Dodaj"} />
          </Pressable>
        )}
      </Div>
    </Div>
  );
};
