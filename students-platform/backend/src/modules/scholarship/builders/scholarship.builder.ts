export class ScholarshipAPIRequestBuilder {
    private scheme: string = 'https';
    private host: string = 'api.careeronestop.org';
    private basePath: string = '/v1/Training';
    private userId: string = '';
    private keyword: string = '';
    private location: string = '0';
    private radius: string = '25';
    private occupation: string = '0';
    private programName: string = '0';
    private programLength: string = '0';
    private state: string = '0';
    private region: string = '0';
    private sortColumns: string = '0';
    private sortDirections: string = '0';
    private startRecord: string = '0';
    private limitRecord: string = '10';

    setUserId(userId: string): ScholarshipAPIRequestBuilder {
        this.userId = userId;
        return this;
    }

    setKeyword(keyword: string): ScholarshipAPIRequestBuilder {
        this.keyword = encodeURIComponent(keyword);
        return this;
    }

    setLocation(location: string): ScholarshipAPIRequestBuilder {
        this.location = location;
        return this;
    }

    setRadius(radius: string): ScholarshipAPIRequestBuilder {
        this.radius = radius;
        return this;
    }

    setOccupation(occupation: string): ScholarshipAPIRequestBuilder {
        this.occupation = occupation;
        return this;
    }

    setProgramName(programName: string): ScholarshipAPIRequestBuilder {
        this.programName = programName;
        return this;
    }

    setProgramLength(programLength: string): ScholarshipAPIRequestBuilder {
        this.programLength = programLength;
        return this;
    }

    setState(state: string): ScholarshipAPIRequestBuilder {
        this.state = state;
        return this;
    }

    setRegion(region: string): ScholarshipAPIRequestBuilder {
        this.region = region;
        return this;
    }

    setSortColumns(sortColumns: string): ScholarshipAPIRequestBuilder {
        this.sortColumns = sortColumns;
        return this;
    }

    setSortDirections(sortDirections: string): ScholarshipAPIRequestBuilder {
        this.sortDirections = sortDirections;
        return this;
    }

    setStartRecord(startRecord: string): ScholarshipAPIRequestBuilder {
        this.startRecord = startRecord;
        return this;
    }

    setLimitRecord(limitRecord: string): ScholarshipAPIRequestBuilder {
        this.limitRecord = limitRecord;
        return this;
    }

    build(): string {
        const path = `${this.basePath}/${this.userId}/${this.keyword}/${this.location}/${this.radius}/${this.occupation}/${this.programName}/${this.programLength}/${this.state}/${this.region}/${this.sortColumns}/${this.sortDirections}/${this.startRecord}/${this.limitRecord}`;
        return `${this.scheme}://${this.host}${path}`;
    }
}
