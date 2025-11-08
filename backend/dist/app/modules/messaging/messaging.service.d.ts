import { ConversationSummary, MessageSummary, MessagingContact } from "./messaging.interface";
import { UserRole } from "../user/user.interface";
type AuthUser = {
    id: string;
    role: UserRole | string;
    schoolId?: string;
};
interface CreateConversationPayload {
    participantIds: string[];
    contextStudentId?: string;
}
interface ListMessagesQuery {
    cursor?: Date;
    limit?: number;
}
declare class MessagingService {
    private ensureEnabled;
    private getAuthUserDocument;
    private getTeacherByUserId;
    private getStudentById;
    private getParentByUserId;
    private loadUserSummaries;
    private buildParticipantHash;
    private ensureAllowedRole;
    private ensureTeacherCanAccessStudent;
    private formatContact;
    private getContactsForTeacher;
    private getContactsForStudent;
    private getContactsForParent;
    listContacts(authUser: AuthUser): Promise<MessagingContact[]>;
    private resolveContextStudent;
    private ensureConversationComposition;
    createConversation(authUser: AuthUser, payload: CreateConversationPayload): Promise<ConversationSummary>;
    private buildConversationSummary;
    listConversations(authUser: AuthUser): Promise<ConversationSummary[]>;
    private authorizeConversationAccess;
    listMessages(authUser: AuthUser, conversationId: string, query: ListMessagesQuery): Promise<{
        messages: MessageSummary[];
        nextCursor?: Date;
    }>;
    sendMessage(authUser: AuthUser, conversationId: string, body: string): Promise<MessageSummary>;
}
export declare const messagingService: MessagingService;
export {};
//# sourceMappingURL=messaging.service.d.ts.map