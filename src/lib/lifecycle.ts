import {
    COMPLAINT_ADMIN_DELAY_DAYS,
    CONTRACT_LOCK_DAYS,
    DEFAULT_MAX_RESCHEDULES,
    INTERVAL_MAX_DAYS,
    INTERVAL_MIN_DAYS,
    REDO_COOLDOWN_DAYS,
} from "@/lib/data/status";

export type ServiceStage = 1 | 2 | 3;

export function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

export function daysBetween(from: Date, to: Date) {
    const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
    return Math.round(ms / 86_400_000);
}

export function sameCalendarMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function formatDisplayDate(date: Date) {
    return date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
}

export function formatDdMmYyyy(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
}

export function parseFlexibleDate(value: string | Date | null | undefined) {
    if (!value) {
        return null;
    }
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    const iso = new Date(value);
    if (!Number.isNaN(iso.getTime()) && !/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        return iso;
    }
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
        const parsed = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function intervalWindow(previousCompletedAt: Date) {
    return {
        min: addDays(previousCompletedAt, INTERVAL_MIN_DAYS),
        max: addDays(previousCompletedAt, INTERVAL_MAX_DAYS),
        lock: addDays(previousCompletedAt, CONTRACT_LOCK_DAYS),
    };
}

export function assertServiceDate(input: {
    serviceNumber: number;
    proposedDate: Date;
    purchasedAt?: Date | null;
    previousCompletedAt?: Date | null;
    allowOverride?: boolean;
}) {
    if (input.allowOverride) {
        return {ok: true as const};
    }

    if (input.serviceNumber <= 1) {
        if (input.purchasedAt && !sameCalendarMonth(input.proposedDate, input.purchasedAt)) {
            return {
                ok: false as const,
                error: "First service must be completed in the same calendar month as purchase.",
            };
        }
        return {ok: true as const};
    }

    if (!input.previousCompletedAt) {
        return {ok: false as const, error: "Previous service must be completed before scheduling the next visit."};
    }

    const window = intervalWindow(input.previousCompletedAt);
    if (input.proposedDate < window.min || input.proposedDate > window.max) {
        return {
            ok: false as const,
            error: `Service ${input.serviceNumber} must be scheduled ${INTERVAL_MIN_DAYS}–${INTERVAL_MAX_DAYS} days after the previous visit.`,
        };
    }
    return {ok: true as const};
}

export function isContractPastLock(previousCompletedAt: Date | null | undefined, now = new Date()) {
    if (!previousCompletedAt) {
        return false;
    }
    return daysBetween(previousCompletedAt, now) > CONTRACT_LOCK_DAYS;
}

export function daysUntilLock(previousCompletedAt: Date | null | undefined, now = new Date()) {
    if (!previousCompletedAt) {
        return null;
    }
    return CONTRACT_LOCK_DAYS - daysBetween(previousCompletedAt, now);
}

export function canReschedule(rescheduleCount: number, maxReschedules = DEFAULT_MAX_RESCHEDULES) {
    return rescheduleCount < maxReschedules;
}

export function complaintVisibleToAdmin(visibleToAdminAt: Date | null | undefined, now = new Date()) {
    if (!visibleToAdminAt) {
        return true;
    }
    return now.getTime() >= visibleToAdminAt.getTime();
}

export function complaintAdminVisibleAt(raisedAt: Date) {
    return addDays(raisedAt, COMPLAINT_ADMIN_DELAY_DAYS);
}

export function isComplaintSameMonth(serviceDate: Date, complaintDate: Date) {
    return sameCalendarMonth(serviceDate, complaintDate);
}

export function redoEligible(input: {
    attendedAt?: Date | null;
    existingRedoId?: number | null;
    allowOverride?: boolean;
    now?: Date;
}) {
    if (input.allowOverride) {
        return {ok: true as const};
    }
    if (input.existingRedoId) {
        return {ok: false as const, error: "Only one redo is allowed per service unless an administrator overrides."};
    }
    if (!input.attendedAt) {
        return {ok: false as const, error: "Complaint must be attended before a redo can be scheduled."};
    }
    const readyAt = addDays(input.attendedAt, REDO_COOLDOWN_DAYS);
    const now = input.now ?? new Date();
    if (now < readyAt) {
        return {
            ok: false as const,
            error: `Redo can be scheduled ${REDO_COOLDOWN_DAYS} days after the complaint is attended.`,
        };
    }
    return {ok: true as const};
}

export function reminderMilestones(previousCompletedAt: Date) {
    return {
        day90: addDays(previousCompletedAt, INTERVAL_MIN_DAYS),
        day120: addDays(previousCompletedAt, INTERVAL_MAX_DAYS),
        day151: addDays(previousCompletedAt, CONTRACT_LOCK_DAYS),
    };
}

export function asServiceStage(value: number | null | undefined): ServiceStage {
    if (value === 2) {
        return 2;
    }
    if (value === 3) {
        return 3;
    }
    return 1;
}
