import { z } from "zod";

export const sElevenLabsUserResSchema = z
    .object({
        user_id: z.string(),
        subscription: z
            .object({
                tier: z.string(),
                character_count: z.number(),
                character_limit: z.number(),
                next_character_count_reset_unix: z.number().nullable(),
                voice_slots_used: z.number(),
                professional_voice_slots_used: z.number(),
                voice_limit: z.number(),
                max_voice_add_edits: z.number(),
                voice_add_edit_counter: z.number(),
                professional_voice_limit: z.number(),
                can_extend_voice_limit: z.boolean(),
                can_use_instant_voice_cloning: z.boolean(),
                can_use_professional_voice_cloning: z.boolean(),
                status: z.enum(["trialing", "active", "incomplete", "past_due", "free", "free_disabled"]),
                billing_period: z.enum(["monthly_period", "annual_period"]).nullable(),
                character_refresh_period: z.enum(["annual_period", "monthly_period"]).nullable(),
            })
            .transform((sub) => ({
                tier: sub.tier,
                characterCount: sub.character_count,
                characterLimit: sub.character_limit,
                nextCharacterCountResetUnix: sub.next_character_count_reset_unix,
                voiceSlotsUsed: sub.voice_slots_used,
                professionalVoiceSlotsUsed: sub.professional_voice_slots_used,
                voiceLimit: sub.voice_limit,
                maxVoiceAddEdits: sub.max_voice_add_edits,
                voiceAddEditCounter: sub.voice_add_edit_counter,
                professionalVoiceLimit: sub.professional_voice_limit,
                canExtendVoiceLimit: sub.can_extend_voice_limit,
                canUseInstantVoiceCloning: sub.can_use_instant_voice_cloning,
                canUseProfessionalVoiceCloning: sub.can_use_professional_voice_cloning,
                status: sub.status,
                billingPeriod: sub.billing_period,
                characterRefreshPeriod: sub.character_refresh_period,
            })),
        is_new_user: z.boolean(),
        is_onboarding_completed: z.literal(true),
        is_onboarding_checklist_completed: z.boolean(),
        first_name: z.string().nullable(),
        created_at: z.number(),
    })
    .transform((data) => ({
        userID: data.user_id,
        subscription: data.subscription,
        isNewUser: data.is_new_user,
        isOnboardingCompleted: data.is_onboarding_completed,
        isOnboardingChecklistCompleted: data.is_onboarding_checklist_completed,
        firstName: data.first_name,
        createdAt: data.created_at,
    }));

export type tElevenLabsUserRes = z.infer<typeof sElevenLabsUserResSchema>;
