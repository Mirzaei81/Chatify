export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          author: string
          body: string | null
          created_at: string | null
          id: string
          room_id: string
        }
        Insert: {
          author?: string
          body?: string | null
          created_at?: string | null
          id?: string
          room_id: string
        }
        Update: {
          author?: string
          body?: string | null
          created_at?: string | null
          id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
        ]
      }
      room: {
        Row: {
          created_at: string | null
          creator: string
          Icon: string | null
          id: string
          members: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          creator: string
          Icon?: string | null
          id?: string
          members?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          creator?: string
          Icon?: string | null
          id?: string
          members?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      room_user: {
        Row: {
          room_id: string
          user_id: string
        }
        Insert: {
          room_id: string
          user_id: string
        }
        Update: {
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_user_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          icon: string | null
          id: string
          user_name: string
        }
        Insert: {
          age?: number | null
          icon?: string | null
          id: string
          user_name: string
        }
        Update: {
          age?: number | null
          icon?: string | null
          id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_messages_by_room_name: {
        Args: {
          room_name: string
        }
        Returns: {
          message_body: string
          author: string
          url: string
          created_at: string
        }[]
      }
      get_messages_given_room_name: {
        Args: {
          room_id: number
          message_id: number
        }
        Returns: {
          message_body: string
          user_icon: string
          user_name: string
          created_at: string
        }[]
      }
      get_rooms_messages: {
        Args: {
          room_id_input: string
        }
        Returns: {
          author: string
          body: string | null
          created_at: string | null
          id: string
          room_id: string
        }[]
      }
      hello: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          creator: string
          Icon: string | null
          id: string
          members: number | null
          name: string
        }[]
      }
      insert_message: {
        Args: {
          body: string
          created_at: number
          room_name: string
          username: string
        }
        Returns: {
          user_id: string
          roomname: string
          messagebody: string
          message_created_at: string
          user_name: string
        }[]
      }
      isroomexist: {
        Args: {
          room_name: string
        }
        Returns: boolean
      }
      join_user_room: {
        Args: {
          user_id_input: string
          room_id_input: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      message_dto: {
        author_user_name: string | null
        body: string | null
        created_at: string | null
        icon_url: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
