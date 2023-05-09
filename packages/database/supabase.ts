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
      _PeopleOnPic: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
      }
      Attending: {
        Row: {
          accepted: boolean | null
          createdAt: string
          id: string
          partyId: string
          userId: string
        }
        Insert: {
          accepted?: boolean | null
          createdAt?: string
          id?: string
          partyId: string
          userId: string
        }
        Update: {
          accepted?: boolean | null
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
          createdAt: string
          id: string
          pic_url: string
          postId: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          pic_url: string
          postId?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          pic_url?: string
          postId?: string | null
          updatedAt?: string | null
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
          chatId: string | null
          createdAt: string
          description: string
          ended: boolean
          hostId: string
          id: string
          imageUrl: string | null
          location: string
          name: string
          tags: string[] | null
          time_starting: string
          updatedAt: string
        }
        Insert: {
          chatId?: string | null
          createdAt?: string
          description: string
          ended?: boolean
          hostId: string
          id?: string
          imageUrl?: string | null
          location: string
          name: string
          tags?: string[] | null
          time_starting: string
          updatedAt?: string
        }
        Update: {
          chatId?: string | null
          createdAt?: string
          description?: string
          ended?: boolean
          hostId?: string
          id?: string
          imageUrl?: string | null
          location?: string
          name?: string
          tags?: string[] | null
          time_starting?: string
          updatedAt?: string
        }
      }
      Post: {
        Row: {
          authorId: string | null
          created_at: string | null
          description: string | null
          id: string
          partyId: string | null
        }
        Insert: {
          authorId?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          partyId?: string | null
        }
        Update: {
          authorId?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          partyId?: string | null
        }
      }
      Users: {
        Row: {
          age: number | null
          bio: string | null
          created_at: string | null
          displayname: string
          id: string
          imagesId: string | null
          location: string | null
          name: string
          pushtoken: string | null
          surname: string
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          displayname: string
          id: string
          imagesId?: string | null
          location?: string | null
          name: string
          pushtoken?: string | null
          surname: string
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          displayname?: string
          id?: string
          imagesId?: string | null
          location?: string | null
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
      get_last_messages:
        | {
            Args: {
              user_id: number
            }
            Returns: {
              chat_id: number
              party_id: number
              last_message_content: string
              last_message_created_at: string
              displayname: string
            }[]
          }
        | {
            Args: {
              user_id: string
            }
            Returns: {
              chat_id: number
              party_id: number
              last_message_content: string
              last_message_created_at: string
              displayname: string
            }[]
          }
      get_messages_for_user: {
        Args: {
          user_id: string
        }
        Returns: {
          chat_id: string
          party_id: string
          party_name: string
          last_message_content: string
          last_message_created_at: string
          displayname: string
        }[]
      }
      get_user_chats_last_message: {
        Args: {
          user_id: string
        }
        Returns: {
          chat_id: string
          party_id: string
          last_message_content: string
          last_message_created_at: string
        }[]
      }
      search_users: {
        Args: {
          username: string
        }
        Returns: {
          id: string
          name: string
          displayname: string
        }[]
      }
      search_usersname: {
        Args: {
          username: string
        }
        Returns: {
          id: string
          name: string
          displayname: string
          imagesId: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
