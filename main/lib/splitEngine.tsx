import dbConnect from "./db";
import Gift from "./models/Gift";
import GiftClaim from "./models/GiftClaim";

/**
 * Split Engine - Processes gifts that have reached their duration
 * and distributes the amount among claims
 */
export async function splitEngine(slug?: string) {
    try {
        await dbConnect();

        // Find all gifts where:
        // 1. Duration has been reached (createdAt + duration days <= now)
        // 2. Not yet processed (we'll add a 'processed' field)
        const now = new Date();

        const query: any = { verified: true };
        if (slug) {
            query.slug = slug;
        }

        const gifts = await Gift.find(query);

        const results = {
            processed: 0,
            failed: 0,
            details: [] as any[],
        };

        for (const gift of gifts) {
            try {
                // Calculate if duration has elapsed
                const createdDate = new Date(gift.createdAt);
                const durationEndDate = new Date(createdDate);
                durationEndDate.setDate(durationEndDate.getDate() + gift.duration);

                // Check if duration has elapsed and dispense date has passed
                const dispenseDate = new Date(gift.dispense);
                if (now < durationEndDate || now < dispenseDate) {
                    continue; // Skip this gift, not ready yet
                }

                // Get all claims for this gift
                const claims = await GiftClaim.find({
                    giftId: gift._id,
                    claimed: false, // Only unclaimed
                });

                if (claims.length === 0) {
                    results.details.push({
                        giftId: gift._id,
                        giftTitle: gift.title,
                        status: "skipped",
                        reason: "No claims found",
                    });
                    continue;
                }

                // Calculate amount per claim
                // If claims exceed splits, only process up to splits count
                const claimsToProcess = claims.slice(0, gift.splits);
                const amountPerClaim = gift.amount / claimsToProcess.length;

                // Mark claims as processed
                for (const claim of claimsToProcess) {
                    claim.claimed = true;
                    claim.claimDetails.claimedAt = now;
                    // Here you would integrate with payment/disbursement service
                    // For now, we just mark as claimed
                    await claim.save();
                }

                results.processed++;
                results.details.push({
                    giftId: gift._id,
                    giftTitle: gift.title,
                    status: "success",
                    claimsProcessed: claimsToProcess.length,
                    amountPerClaim,
                    totalDistributed: amountPerClaim * claimsToProcess.length,
                });

                console.log(
                    `Processed gift ${gift.title}: ${claimsToProcess.length} claims, ${amountPerClaim} each`
                );
            } catch (error) {
                results.failed++;
                results.details.push({
                    giftId: gift._id,
                    giftTitle: gift.title,
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                console.error(`Failed to process gift ${gift._id}:`, error);
            }
        }

        return results;
    } catch (error) {
        console.error("Split engine error:", error);
        throw error;
    }
}

/**
 * Manual trigger for testing - processes a specific gift
 */
export async function processSingleGift(slug: string) {
    try {
        await dbConnect();

        const gift = await Gift.findOne({ slug });
        if (!gift) {
            throw new Error("Gift not found");
        }

        const claims = await GiftClaim.find({
            giftId: gift._id,
            claimed: false,
        });

        if (claims.length === 0) {
            return {
                status: "skipped",
                reason: "No claims found",
            };
        }

        const claimsToProcess = claims.slice(0, gift.splits);
        const amountPerClaim = gift.amount / claimsToProcess.length;
        const now = new Date();

        for (const claim of claimsToProcess) {
            claim.claimed = true;
            claim.claimDetails.claimedAt = now;
            await claim.save();
        }

        return {
            status: "success",
            claimsProcessed: claimsToProcess.length,
            amountPerClaim,
            totalDistributed: amountPerClaim * claimsToProcess.length,
        };
    } catch (error) {
        console.error("Process single gift error:", error);
        throw error;
    }
}
