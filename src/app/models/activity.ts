export interface Activity {
    id: number,
    name: string,
    activityCategoryId: number,
    startTime: Date,
    endTime?: Date
    timeSpan?: string
}