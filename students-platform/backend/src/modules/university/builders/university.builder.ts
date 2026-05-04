export class UniversityAPIRequestBuilder {
    private scheme: string = 'http';
    private host: string = 'universities.hipolabs.com';
    private basePath: string = '/search';
    private name?: string;
    private country?: string;

    setScheme(scheme: string): UniversityAPIRequestBuilder {
        this.scheme = scheme;
        return this;
    }

    setHost(host: string): UniversityAPIRequestBuilder {
        this.host = host;
        return this;
    }

    setBasePath(basePath: string): UniversityAPIRequestBuilder {
        this.basePath = basePath;
        return this;
    }

    setName(name: string): UniversityAPIRequestBuilder {
        this.name = encodeURIComponent(name);
        return this;
    }

    setCountry(country: string): UniversityAPIRequestBuilder {
        this.country = encodeURIComponent(country);
        return this;
    }

    build(): string {
        const params = new URLSearchParams();

        if (this.name) {
            params.set('name', this.name);
        }

        if (this.country) {
            params.set('country', this.country);
        }

        const queryString = params.toString();
        const url = `${this.scheme}://${this.host}${this.basePath}`;

        return queryString ? `${url}?${queryString}` : url;
    }
}
