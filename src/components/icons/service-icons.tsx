import type {ReactNode, SVGProps} from "react";

export type ServiceIconProps = SVGProps<SVGSVGElement>;

function IconBase({children, className, ...props}: ServiceIconProps & {children: ReactNode}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className={className}
            {...props}
        >
            {children}
        </svg>
    );
}

export function BedbugIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 20v-9" />
                <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
                <path d="M14.12 3.88 16 2" />
                <path d="M21 21a4 4 0 0 0-3.81-4" />
                <path d="M21 5a4 4 0 0 1-3.55 3.97" />
                <path d="M22 13h-4" />
                <path d="M3 21a4 4 0 0 1 3.81-4" />
                <path d="M3 5a4 4 0 0 0 3.55 3.97" />
                <path d="M6 13H2" />
                <path d="m8 2 1.88 1.88" />
                <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
            </g>
        </IconBase>
    );
}

export function CockroachIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                d="M10.7 4.55C8.15 2.1 4.7 1.85 3.25 3.55M13.3 4.55C15.85 2.1 19.3 1.85 20.75 3.55M8.4 9.1 4.55 7.15M7.55 13.2 3.2 13.45M8.35 17.4 4.7 20.15M15.6 9.1 19.45 7.15M16.45 13.2 20.8 13.45M15.65 17.4 19.3 20.15M10.35 20.7 9.05 22.55M13.65 20.7 14.95 22.55"
            />
            <ellipse cx="12" cy="14.35" rx="4.05" ry="6.35" />
            <ellipse cx="12" cy="8.05" rx="4.7" ry="2.85" />
            <ellipse cx="12" cy="5.45" rx="1.75" ry="1.35" />
            <path d="M12 9.4v10.6" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
        </IconBase>
    );
}

export function MosquitoIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <ellipse cx="14.2" cy="8.3" rx="6.3" ry="2.05" transform="rotate(-32 14.2 8.3)" />
            <ellipse cx="15.5" cy="6.7" rx="5.1" ry="1.45" transform="rotate(-40 15.5 6.7)" />
            <ellipse cx="13.9" cy="11.7" rx="5.5" ry="1.5" transform="rotate(-28 13.9 11.7)" />
            <circle cx="8.55" cy="13.45" r="2" />
            <circle cx="6.15" cy="15.2" r="1.15" />
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                d="M5.2 16.15 2.2 21.1M5.45 14.35 3.35 12.05M6.55 14.15 5.4 11.45M7.55 14.85 3.25 18.7M8.75 15.05 6.35 21.2M10.15 12.55 14.55 3.35M11.35 12.15 18.25 4.15"
            />
        </IconBase>
    );
}

export function RodentIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M13 22H4a2 2 0 0 1 0-4h12" />
                <path d="M13.236 18a3 3 0 0 0-2.2-5" />
                <path d="M16 9h.01" />
                <path d="M16.82 3.94a3 3 0 1 1 3.237 4.868l1.815 2.587a1.5 1.5 0 0 1-1.5 2.1l-2.872-.453a3 3 0 0 0-3.5 3" />
                <path d="M17 4.988a3 3 0 1 0-5.2 2.052A7 7 0 0 0 4 14.015 4 4 0 0 0 8 18" />
            </g>
        </IconBase>
    );
}

export function TermiteIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                d="M8.35 8.55 4.55 6.85M7.55 12.35 3.35 12.55M8.45 16.15 4.75 18.85M15.65 8.55 19.45 6.85M16.45 12.35 20.65 12.55M15.55 16.15 19.25 18.85"
            />
            <circle cx="8.15" cy="3.55" r="0.85" />
            <circle cx="6.85" cy="2.25" r="0.7" />
            <circle cx="15.85" cy="3.55" r="0.85" />
            <circle cx="17.15" cy="2.25" r="0.7" />
            <rect x="8.35" y="4.35" width="7.3" height="5.15" rx="1.55" />
            <ellipse cx="12" cy="11.85" rx="3.35" ry="2.35" />
            <ellipse cx="12" cy="17.55" rx="3.85" ry="3.45" />
        </IconBase>
    );
}

export function WoodBorerIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <path
                fillRule="evenodd"
                d="M2.6 14.35h18.8v7.05H2.6zM8.35 16.9a1.2 1.2 0 1 0-2.4 0 1.2 1.2 0 0 0 2.4 0zM12.7 16.15a1 1 0 1 0-2 0 1 1 0 0 0 2 0zM16.85 17.3a.85.85 0 1 0-1.7 0 .85.85 0 0 0 1.7 0z"
            />
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                d="M9.15 8.15 6.45 6.05M8.85 11.15 5.75 11.55M14.85 8.15 17.55 6.05M15.15 11.15 18.25 11.55"
            />
            <ellipse cx="12" cy="9.85" rx="2.55" ry="4.35" />
            <ellipse cx="12" cy="5.15" rx="1.65" ry="1.45" />
        </IconBase>
    );
}

export function InvisibleGrillIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <path fillRule="evenodd" d="M3.2 2.4h17.6v19.2H3.2zm2.15 2.15h13.3v14.9H5.35z" />
            <path d="M6.05 6.55h11.9v1.05H6.05zm0 3.15h11.9v1.05H6.05zm0 3.15h11.9v1.05H6.05zm0 3.15h11.9v1.05H6.05z" />
        </IconBase>
    );
}

export function BirdProofingIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <path d="M2.4 19.15h19.2v2.45H2.4z" />
            <path d="M4.1 19.15 5.35 14.4h1.15L5.25 19.15zm3.3 0 1.25-5.2h1.15l-1.25 5.2zm3.3 0 1.25-5.55h1.15L11.85 19.15zm3.3 0 1.25-5.2h1.15l-1.25 5.2z" />
            <path d="M13.35 13.85c2.55-2.05 5.85-1.55 7.15.85.55 1.05.45 2.15-.15 3.05h-5.35c-1.55 0-2.65-.85-2.85-2.05-.15-.95.25-1.45 1.2-1.85z" />
            <circle cx="14.55" cy="11.15" r="1.85" />
            <path d="M12.55 11.35 10.85 10.55v1.15z" />
        </IconBase>
    );
}

export function RatGuardIcon(props: ServiceIconProps) {
    return (
        <IconBase {...props}>
            <ellipse cx="12" cy="11.15" rx="8.65" ry="3.45" />
            <rect x="9.85" y="2.15" width="4.3" height="19.7" rx="0.85" />
        </IconBase>
    );
}
