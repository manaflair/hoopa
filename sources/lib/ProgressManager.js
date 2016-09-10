export class ProgressManager {

    constructor({ root = this, onNotify = () => {} } = {}) {

        this.root = root;
        this.onNotify = onNotify;

        this.startedAt = null;
        this.endedAt = null;

        this.children = [];

        Reflect.defineProperty(this, `isStarted`, {
            get() { return this.startedAt !== null }
        });

        Reflect.defineProperty(this, `isEnded`, {
            get() { return this.endedAt !== null }
        });

    }

    start() {

        this.startedAt = new Date();

        return this;

    }

    end() {

        this.endedAt = new Date();

        this.root.onNotify(this.root);

        return this;

    }

    makeChild() {

        return new ProgressManager({ root: this.root });

    }

    makeChildBucket(childCount) {

        let bucket = [];
        this.children.push(bucket);

        for (let t = 0; t < childCount; ++t)
            bucket.push(this.makeChild());

        return bucket;

    }

    getBucketEstimatedDuration(bucket) {

        let totalActualDuration = 0;
        let totalFinishedChildCount = 0;

        let totalGuessedDuration = 0;
        let totalRunningChildCount = 0;

        for (let child of bucket) {
            if (child.isEnded) {
                totalActualDuration += child.getActualDuration();
                totalFinishedChildCount += 1;
            } else if (child.isStarted) {
                totalGuessedDuration += child.getEstimatedDuration();
                totalRunningChildCount += 1;
            }
        }

        let averageActualDuration = totalActualDuration / totalFinishedChildCount;
        let averageGuessedDuration = totalGuessedDuration / totalRunningChildCount;

        if (isNaN(averageActualDuration))
            averageActualDuration = 0;

        if (isNaN(averageGuessedDuration))
            averageGuessedDuration = 0;

        let averageEstimatedDuration = Math.max(averageActualDuration, averageGuessedDuration);
        let estimatedDuration = totalActualDuration + averageEstimatedDuration * (bucket.length - totalFinishedChildCount);

        return estimatedDuration;

    }

    getEstimatedDuration() {

        let estimatedDuration = 0;

        for (let bucket of this.children)
            estimatedDuration += this.getBucketEstimatedDuration(bucket);

        return estimatedDuration;

    }

    getActualDuration() {

        return this.endedAt - this.startedAt;

    }

    guessDuration() {

        let duration;

        if (this.isEnded) {
            duration = this.getActualDuration();
        } else if (this.isStarted) {
            duration = this.getEstimatedDuration();
        } else {
            duration = 0;
        }

        return duration;

    }

    getElapsedTime() {

        if (this.isEnded) {
            return this.getActualDuration();
        } else if (this.isStarted) {
            return new Date() - this.startedAt;
        } else {
            return 0;
        }

    }

}
