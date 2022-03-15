import { httpGet } from './mock-http-interface';

enum TResultType {
  ARNIE_QUOTE = 'Arnie Quote',
  FAILURE = 'FAILURE',
}

type QuoteResponse = {
  status: number;
  body: string;
}

type TResult = { [key in TResultType]?: string; }

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  return await Promise.all(
    urls.map(url => getArnieQuote(url))
  );
};

const getArnieQuote = async (url: string): Promise<TResult> => {
  const response = await httpGet(url);

  return transformResult(response);
}

const transformResult = ({ status, body }: QuoteResponse): TResult => {
  try {
    const type = status === 200 ? TResultType.ARNIE_QUOTE : TResultType.FAILURE;
    return { [type]: JSON.parse(body).message }
  } catch (err: unknown) {
    return { [TResultType.FAILURE]: 'Unable to parse quote response' }
  }
}
