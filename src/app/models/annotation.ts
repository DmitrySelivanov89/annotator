export interface Annotation {
 readonly id: string;
 readonly articleId: string;
 readonly startOffset: number;
 readonly endOffset: number;
 readonly selectedText: string;
 readonly color: string;
 readonly note: string;
 readonly createdAt: number;
}
