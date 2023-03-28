export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Attending: {
        Row: {
          createdAt: string
          id: string
          partyId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          partyId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          partyId?: string
          userId?: string
        }
      }
      Chat: {
        Row: {
          createdAt: string
          id: string
          partyId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          partyId: string
        }
        Update: {
          createdAt?: string
          id?: string
          partyId?: string
        }
      }
      Comment: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          id: string
          imageId: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          id?: string
          imageId: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          id?: string
          imageId?: string
          updatedAt?: string
        }
      }
      Friendship: {
        Row: {
          accepted: boolean
          blocked: boolean
          createdAt: string
          id: string
          userAId: string
          userBId: string
        }
        Insert: {
          accepted?: boolean
          blocked?: boolean
          createdAt?: string
          id?: string
          userAId: string
          userBId: string
        }
        Update: {
          accepted?: boolean
          blocked?: boolean
          createdAt?: string
          id?: string
          userAId?: string
          userBId?: string
        }
      }
      Images: {
        Row: {
          authorId: string
          createdAt: string
          description: string
          id: string
          partyId: string
          pic_url: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          createdAt?: string
          description: string
          id?: string
          partyId: string
          pic_url: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          createdAt?: string
          description?: string
          id?: string
          partyId?: string
          pic_url?: string
          updatedAt?: string
        }
      }
      Message: {
        Row: {
          chatId: string
          content: string
          createdAt: string
          id: string
          senderId: string
        }
        Insert: {
          chatId: string
          content: string
          createdAt?: string
          id?: string
          senderId: string
        }
        Update: {
          chatId?: string
          content?: string
          createdAt?: string
          id?: string
          senderId?: string
        }
      }
      Party: {
        Row: {
          chatId: string
          createdAt: string
          ended: boolean
          hostId: string
          id: string
          location: string
          name: string
          tags: string[] | null
          time_starting: string
          updatedAt: string
        }
        Insert: {
          chatId: string
          createdAt?: string
          ended?: boolean
          hostId: string
          id?: string
          location: string
          name: string
          tags?: string[] | null
          time_starting: string
          updatedAt: string
        }
        Update: {
          chatId?: string
          createdAt?: string
          ended?: boolean
          hostId?: string
          id?: string
          location?: string
          name?: string
          tags?: string[] | null
          time_starting?: string
          updatedAt?: string
        }
      }
      Users: {
        Row: {
          bio: string | null
          created_at: string | null
          displayname: string
          id: string
          imagesId: string | null
          name: string
          pushtoken: string | null
          surname: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          displayname: string
          id: string
          imagesId?: string | null
          name: string
          pushtoken?: string | null
          surname: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          displayname?: string
          id?: string
          imagesId?: string | null
          name?: string
          pushtoken?: string | null
          surname?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
