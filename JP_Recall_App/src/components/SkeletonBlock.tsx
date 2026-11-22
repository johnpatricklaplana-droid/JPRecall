type SkeletonBlockProps = {
    className: string;
};

export default function SkeletonBlock({
    className,
}: Readonly<SkeletonBlockProps>) {
    return (
        <span
            aria-hidden="true"
            className={`block animate-pulse rounded-md bg-[#263344] motion-reduce:animate-none ${className}`}
        />
    );
}
