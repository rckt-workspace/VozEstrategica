export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          contacto: string
          created_at: string
          email: string
          estado: string
          fecha_evento: string | null
          id: string
          mensaje: string | null
          organizacion: string
          presupuesto: string | null
          speaker_id: string | null
          telefono: string | null
          tipo_evento: string | null
        }
        Insert: {
          contacto: string
          created_at?: string
          email: string
          estado?: string
          fecha_evento?: string | null
          id?: string
          mensaje?: string | null
          organizacion: string
          presupuesto?: string | null
          speaker_id?: string | null
          telefono?: string | null
          tipo_evento?: string | null
        }
        Update: {
          contacto?: string
          created_at?: string
          email?: string
          estado?: string
          fecha_evento?: string | null
          id?: string
          mensaje?: string | null
          organizacion?: string
          presupuesto?: string | null
          speaker_id?: string | null
          telefono?: string | null
          tipo_evento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          anio: number | null
          autor_speaker_id: string | null
          created_at: string
          descripcion: string | null
          id: string
          link_compra: string | null
          portada_url: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          anio?: number | null
          autor_speaker_id?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          link_compra?: string | null
          portada_url?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          anio?: number | null
          autor_speaker_id?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          link_compra?: string | null
          portada_url?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_autor_speaker_id_fkey"
            columns: ["autor_speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion: {
        Row: {
          created_at: string
          flete_nacional: number
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flete_nacional?: number
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flete_nacional?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          ciudad: string
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          imagen_url: string | null
          speaker_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ciudad: string
          created_at?: string
          descripcion?: string | null
          fecha: string
          id?: string
          imagen_url?: string | null
          speaker_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ciudad?: string
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          imagen_url?: string | null
          speaker_id?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          bold_tx_id: string | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          order_id: string | null
          payment_reference: string | null
          product: string | null
          raw_payload: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          bold_tx_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          payment_reference?: string | null
          product?: string | null
          raw_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          bold_tx_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          payment_reference?: string | null
          product?: string | null
          raw_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pedidos_libros: {
        Row: {
          bold_order_id: string | null
          cantidad: number
          ciudad: string | null
          departamento: string | null
          direccion: string | null
          email: string
          estado_pago: string
          fecha_creacion: string
          flete: number
          formato: string
          id: string
          libro: string
          nombre_completo: string
          precio_unitario: number
          subtotal: number
          telefono: string
          total: number
          updated_at: string
        }
        Insert: {
          bold_order_id?: string | null
          cantidad?: number
          ciudad?: string | null
          departamento?: string | null
          direccion?: string | null
          email: string
          estado_pago?: string
          fecha_creacion?: string
          flete?: number
          formato: string
          id?: string
          libro: string
          nombre_completo: string
          precio_unitario: number
          subtotal: number
          telefono: string
          total: number
          updated_at?: string
        }
        Update: {
          bold_order_id?: string | null
          cantidad?: number
          ciudad?: string | null
          departamento?: string | null
          direccion?: string | null
          email?: string
          estado_pago?: string
          fecha_creacion?: string
          flete?: number
          formato?: string
          id?: string
          libro?: string
          nombre_completo?: string
          precio_unitario?: number
          subtotal?: number
          telefono?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      speakers: {
        Row: {
          bio: string | null
          created_at: string
          destacado: boolean
          especialidad: string
          foto_url: string | null
          id: string
          nombre: string
          orden: number
          slug: string
          tematicas: string[]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          destacado?: boolean
          especialidad: string
          foto_url?: string | null
          id?: string
          nombre: string
          orden?: number
          slug: string
          tematicas?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          destacado?: boolean
          especialidad?: string
          foto_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          slug?: string
          tematicas?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _notify_call: { Args: { fn: string; payload: Json }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
